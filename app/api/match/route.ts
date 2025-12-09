import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

// 매칭 요청
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, country } = body;

    if (!userId || !country) {
      return NextResponse.json({
        error: 'userId and country are required',
        success: false
      }, { status: 400 });
    }

    if (country !== 'KR' && country !== 'JP') {
      return NextResponse.json({
        error: 'Invalid country. Only KR or JP allowed.',
        success: false
      }, { status: 400 });
    }

    // 반대 국가 결정
    const oppositeCountry = country === 'KR' ? 'JP' : 'KR';
    
    // 대기 큐에서 반대 국가의 대기자 찾기
    const waitingQueueRef = collection(db, 'waiting_queue');
    const oppositeQueueQuery = query(
      waitingQueueRef,
      where('country', '==', oppositeCountry),
      where('status', '==', 'waiting')
    );

    const oppositeQueueSnapshot = await getDocs(oppositeQueueQuery);
    
    // 현재 사용자의 대기 순서 확인 (같은 국가)
    const sameCountryQuery = query(
      waitingQueueRef,
      where('country', '==', country),
      where('status', '==', 'waiting')
    );
    const sameCountrySnapshot = await getDocs(sameCountryQuery);
    const waitingPosition = sameCountrySnapshot.size + 1; // 현재 사용자 포함
    
    if (oppositeQueueSnapshot.empty) {
      // 매칭 상대가 없으면 대기 큐에 추가
      const waitingDoc = {
        userId,
        country,
        status: 'waiting',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(waitingQueueRef, waitingDoc);
      
      return NextResponse.json({
        success: true,
        matched: false,
        waitingId: docRef.id,
        waitingPosition,
        oppositeQueueCount: 0,
        message: 'Waiting for match...'
      });
    } else {
      // 매칭 상대 발견 - 첫 번째 대기자와 매칭
      const matchedUser = oppositeQueueSnapshot.docs[0];
      const matchedUserId = matchedUser.data().userId;
      
      // 채팅방 생성
      const chatId = `${userId}_${matchedUserId}_${Date.now()}`;
      const chatRef = doc(db, 'active_chats', chatId);
      
      await setDoc(chatRef, {
        chatId,
        participants: [userId, matchedUserId],
        countries: {
          [userId]: country,
          [matchedUserId]: oppositeCountry
        },
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        status: 'active'
      });

      // 대기 큐에서 매칭된 사용자 제거
      await deleteDoc(matchedUser.ref);
      
      // 현재 사용자도 대기 큐에 있었다면 제거
      const currentUserQuery = query(
        waitingQueueRef,
        where('userId', '==', userId),
        where('status', '==', 'waiting')
      );
      const currentUserSnapshot = await getDocs(currentUserQuery);
      await Promise.all(
        currentUserSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      );

      return NextResponse.json({
        success: true,
        matched: true,
        chatId,
        matchedUserId,
        waitingPosition: 0,
        oppositeQueueCount: oppositeQueueSnapshot.size - 1, // 매칭된 사용자 제외
        message: 'Match found!'
      });
    }
  } catch (error: any) {
    console.error('Match error:', error);
    return NextResponse.json({
      error: 'Failed to process match request',
      success: false
    }, { status: 500 });
  }
}

// 매칭 취소
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
        success: false
      }, { status: 400 });
    }

    // 대기 큐에서 사용자 제거
    const waitingQueueRef = collection(db, 'waiting_queue');
    const userQuery = query(
      waitingQueueRef,
      where('userId', '==', userId),
      where('status', '==', 'waiting')
    );

    const snapshot = await getDocs(userQuery);
    await Promise.all(
      snapshot.docs.map((doc) => deleteDoc(doc.ref))
    );

    return NextResponse.json({
      success: true,
      message: 'Match cancelled'
    });
  } catch (error: any) {
    console.error('Cancel match error:', error);
    return NextResponse.json({
      error: 'Failed to cancel match',
      success: false
    }, { status: 500 });
  }
}

