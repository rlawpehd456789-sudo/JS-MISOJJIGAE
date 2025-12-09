import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';

// 메시지 전송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, message, country } = body;

    if (!chatId || !userId || !message) {
      return NextResponse.json({
        error: 'chatId, userId, and message are required',
        success: false
      }, { status: 400 });
    }

    const messagesRef = collection(db, 'chat_messages');
    const messageDoc = {
      chatId,
      userId,
      message: message.trim(),
      country: country || 'UNKNOWN',
      createdAt: serverTimestamp(),
      read: false
    };

    const docRef = await addDoc(messagesRef, messageDoc);

    // 채팅방의 lastMessageAt 업데이트
    const chatRef = doc(db, 'active_chats', chatId);
    await updateDoc(chatRef, {
      lastMessageAt: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      messageId: docRef.id
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({
      error: 'Failed to send message',
      success: false
    }, { status: 500 });
  }
}

// 메시지 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limitCount = parseInt(searchParams.get('limit') || '50');

    if (!chatId) {
      return NextResponse.json({
        error: 'chatId is required',
        success: false
      }, { status: 400 });
    }

    const messagesRef = collection(db, 'chat_messages');
    const messagesQuery = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(messagesQuery);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null
    })).reverse(); // 시간순으로 정렬

    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json({
      error: 'Failed to get messages',
      success: false
    }, { status: 500 });
  }
}

