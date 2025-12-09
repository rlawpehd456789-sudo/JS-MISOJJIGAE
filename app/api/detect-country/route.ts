import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 클라이언트 IP 가져오기
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIP = forwarded 
      ? forwarded.split(',')[0].trim() 
      : realIp || request.ip || '127.0.0.1';
    
    // 로컬호스트/개발 환경 체크 (IP 기반)
    const isLocalhost = clientIP === '127.0.0.1' || 
                       clientIP === '::1' || 
                       clientIP === 'localhost' ||
                       clientIP.startsWith('192.168.') ||
                       clientIP.startsWith('10.') ||
                       clientIP.startsWith('172.16.');
    
    // 개발 환경에서만 로컬호스트 허용
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isLocalhost && isDevelopment) {
      // 개발 환경에서만 로컬호스트 허용
      // 환경 변수로 테스트 국가 설정 가능 (기본값: KR)
      const devCountry = process.env.DEV_COUNTRY || 'KR';
      
      return NextResponse.json({
        country: devCountry,
        countryName: devCountry === 'KR' ? 'South Korea (Dev)' : 'Japan (Dev)',
        city: 'Development',
        success: true,
        isDevelopment: true // 개발 모드임을 명시
      });
    }
    
    // 프로덕션 또는 로컬호스트가 아닌 경우 실제 IP로 감지
    // ipapi.co 사용
    const response = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const data = await response.json();
    
    if (data.error) {
      // 로컬호스트인데 개발 모드가 아니면 에러
      if (isLocalhost) {
        return NextResponse.json({
          error: 'Localhost access is only allowed in development mode',
          success: false
        }, { status: 403 });
      }
      
      return NextResponse.json({
        error: data.reason || 'Failed to detect country',
        success: false
      }, { status: 400 });
    }
    
    // 한국(KR) 또는 일본(JP)만 허용
    if (data.country_code === 'KR' || data.country_code === 'JP') {
      return NextResponse.json({
        country: data.country_code,
        countryName: data.country_name,
        city: data.city,
        success: true
      });
    } else {
      return NextResponse.json({
        error: 'Unsupported country. Only Korea (KR) and Japan (JP) are supported.',
        country: data.country_code,
        success: false
      }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Country detection error:', error);
    return NextResponse.json({
      error: 'Failed to detect country',
      success: false
    }, { status: 500 });
  }
}

