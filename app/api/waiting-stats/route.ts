import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';

// 대기 큐 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (!country || (country !== 'KR' && country !== 'JP')) {
      return NextResponse.json({
        error: 'Valid country (KR or JP) is required',
        success: false
      }, { status: 400 });
    }

    const oppositeCountry = country === 'KR' ? 'JP' : 'KR';
    const waitingQueueRef = collection(db, 'waiting_queue');

    // 반대 국가 대기자 수
    const oppositeQueueQuery = query(
      waitingQueueRef,
      where('country', '==', oppositeCountry),
      where('status', '==', 'waiting')
    );
    const oppositeQueueSnapshot = await getDocs(oppositeQueueQuery);

    // 같은 국가 대기자 수
    const sameCountryQuery = query(
      waitingQueueRef,
      where('country', '==', country),
      where('status', '==', 'waiting')
    );
    const sameCountrySnapshot = await getDocs(sameCountryQuery);

    return NextResponse.json({
      success: true,
      oppositeQueueCount: oppositeQueueSnapshot.size,
      sameCountryQueueCount: sameCountrySnapshot.size,
      estimatedWaitTime: calculateEstimatedWaitTime(
        oppositeQueueSnapshot.size,
        sameCountrySnapshot.size
      )
    });
  } catch (error: any) {
    console.error('Waiting stats error:', error);
    return NextResponse.json({
      error: 'Failed to get waiting stats',
      success: false
    }, { status: 500 });
  }
}

// 예상 대기 시간 계산 (초 단위)
function calculateEstimatedWaitTime(
  oppositeQueueCount: number,
  sameCountryQueueCount: number
): number {
  // 평균 매칭 시간: 30초 (실제 데이터 기반으로 조정 가능)
  const averageMatchTime = 30;
  
  // 반대 국가에 대기자가 있으면 즉시 매칭 가능
  if (oppositeQueueCount > 0) {
    return 0;
  }
  
  // 반대 국가에 대기자가 없으면
  // 같은 국가의 대기 순서와 평균 매칭 시간을 기반으로 계산
  // 최소 30초, 최대 5분 (300초)
  const estimatedTime = Math.min(
    Math.max(sameCountryQueueCount * averageMatchTime, 30),
    300
  );
  
  return estimatedTime;
}

