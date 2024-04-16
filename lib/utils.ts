export function formatToTimeAgo(date: string) {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("en");

    // 미래 날짜 처리를 위한 조건 추가
    return formatter.format(diff, "day");
}

export function formatToWon(price: number) {
    return price.toLocaleString("ko-KR");
}
