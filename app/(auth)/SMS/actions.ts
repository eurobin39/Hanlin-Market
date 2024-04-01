"use server";

import { z } from "zod";
import validator from "validator";

// 전화번호 유효성 검사 스키마
const phoneSchema = z.string().trim().refine((phone) => validator.isMobilePhone(phone, "ko-KR"), {
  message: "Invalid phone number.",
});

// 인증 토큰 유효성 검사 스키마
const tokenSchema = z.string().refine((token) => token.length === 6 && validator.isNumeric(token), {
  message: "Invalid token format.",
});

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  // formData에서 전화번호와 토큰 추출
  const phone = formData.get("phone");
  const token = formData.get("token");

  // 토큰 상태가 false일 때만 전화번호 유효성 검사 수행
  if (!prevState.token) {
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      // 전화번호 검증 실패
      return {
        token: false,
      };
    }
    // 여기서 추가적인 로직 (예: SMS 인증 코드 전송) 수행

    // 일단 전화번호 검증이 성공했다면 token을 true로 설정
    // 실제 애플리케이션에서는 이 부분에 SMS 인증 코드가 정확히 입력되었는지 확인하는 로직이 필요
    return {
      token: true,
    };
  } else {
    // 토큰 상태가 true이고, 사용자가 인증 코드를 입력했다면 해당 코드 검증
    const tokenResult = tokenSchema.safeParse(token);
    if (!tokenResult.success) {
      // 토큰 검증 실패
      return {
        token: false,
      };
    }

    // 토큰 검증 성공
    return {
      token: true, // 실제로는 여기서 추가적인 상태 업데이트나 로직이 필요할 수 있음
    };
  }
}
