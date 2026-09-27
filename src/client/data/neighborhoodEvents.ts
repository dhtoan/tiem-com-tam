export interface OfficerProfile {
  name: string;
  role: string;
  demeanor: string;
}

export const COMMUNITY_OFFICERS: Record<string, OfficerProfile> = {
  minh: {
    name: "Đồng chí Minh",
    role: "Cảnh sát khu vực",
    demeanor: "Nghiêm túc, tận tụy, luôn ghé thăm và hướng dẫn bà con biện pháp phòng ngừa.",
  },
  bacBa: {
    name: "Bác Ba Tổ Trưởng",
    role: "Tổ trưởng dân phố",
    demeanor: "Ấm áp, thấu hiểu, thường nhắc nhở thông tin trật tự khu phố mỗi sáng.",
  },
};
