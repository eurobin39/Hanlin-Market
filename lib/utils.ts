export function formatToTimeAgo(date: string): string {
    const time = new Date(date).getTime();
    const now = new Date().getTime();

    // 유효하지 않은 date 값 처리
    if (isNaN(time)) {
        return "방금 전";
    }

    // UTC 기준으로 현재 시간과의 차이를 밀리초로 계산
    const diffInMs = time - now;

    // diffInMs를 일, 시간, 분으로 변환
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInMinutes = diffInMs / (1000 * 60);

    const formatter = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

    // 1분 미만의 차이일 경우 "방금 전" 반환
    if (Math.abs(diffInMinutes) < 1) {
        return "방금 전";
    } else if (Math.abs(diffInHours) < 1) { // 1시간 미만의 차이일 경우
        return formatter.format(Math.round(diffInMinutes), "minute");
    } else if (Math.abs(diffInDays) < 1) { // 1일 미만의 차이일 경우
        return formatter.format(Math.round(diffInHours), "hour");
    } else { // 그 외 (1일 이상의 차이일 경우)
        return formatter.format(Math.round(diffInDays), "day");
    }
}

  
  
  
  export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR");
  }
