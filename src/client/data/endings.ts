import type { EndingDefinition, EndingId } from "../../shared/types/endings";

export const ENDING_DEFINITIONS: Record<EndingId, EndingDefinition> = {
  perfect: {
    id: "perfect",
    title: "Bà Chủ Cơm Tấm Sài Gòn",
    subtitle: "Kết thúc Hoàn Hảo (Perfect Ending)",
    description:
      "Joy trả sạch toàn bộ nợ nần, uy tín vang danh khắp chốn, quán cơm tấm trở thành biểu tượng ẩm thực được thực khách xa gần mến mộ!",
    silhouette: "silhouette_perfect",
    endlessModifierDescription:
      "Mở khóa toàn bộ công thức đặc biệt, nhận bonus doanh thu và uy tín khởi điểm cao.",
  },
  family: {
    id: "family",
    title: "Quán Của Cả Nhà",
    subtitle: "Kết thúc Gia Đình (Family Hidden Ending)",
    description:
      "Không chỉ trả hết nợ, Joy còn thắp lại ngọn lửa tình cảm gia đình. Chồng tự nguyện sát cánh bên Joy quản lý tài chính và hỗ trợ tiệm.",
    silhouette: "silhouette_family",
    endlessModifierDescription:
      "Chồng trở thành Quản lý Tài chính kiêm Hậu cần, tự động tối ưu chi phí mua hàng.",
  },
  jd: {
    id: "jd",
    title: "JD — Trợ Thủ Mùa Hè",
    subtitle: "Kết thúc JD (JD Hidden Ending)",
    description:
      "Kỳ nghỉ hè của JD trở thành bước ngoặt trưởng thành kỳ diệu. JD trở thành cánh tay phải đắc lực không thể thiếu của chị Joy.",
    silhouette: "silhouette_jd",
    endlessModifierDescription:
      "Mở khóa hệ thống Kỹ năng Cấp 2 và phân công ca trực đa nhiệm của JD.",
  },
  neighborhood: {
    id: "neighborhood",
    title: "Quán Ruột Của Cả Khu Phố",
    subtitle: "Kết thúc Khu Phố (Neighborhood Ending)",
    description:
      "Dù còn một chút nợ nhỏ, tiệm cơm của Joy đã trở thành linh hồn ấm áp của cả khu dân cư, được bà con hàng xóm hết lòng bảo bọc.",
    silhouette: "silhouette_neighborhood",
    endlessModifierDescription:
      "Mở khóa nhóm sự kiện cộng đồng cao cấp và dòng khách quen trung thành mỗi ngày.",
  },
  "husband-finance": {
    id: "husband-finance",
    title: "Chồng Giữ Két",
    subtitle: "Kết thúc Tài Chính (Husband Finance Ending)",
    description:
      "Quán kinh doanh có lãi nhưng chưa dứt điểm được nợ. Chồng tạm thời nắm quyền kiểm soát chi tiêu lớn cho đến khi tiệm tự chủ hoàn toàn.",
    silhouette: "silhouette_husband_finance",
    endlessModifierDescription:
      "Chồng kiểm duyệt ngân sách các nâng cấp lớn cho đến khi Joy tích lũy đủ vốn tự do.",
  },
  comeback: {
    id: "comeback",
    title: "Làm Lại Cho Đàng Hoàng",
    subtitle: "Kết thúc Vượt Khó (Comeback Ending)",
    description:
      "Kèo 30 ngày đầy sóng gió khiến tiệm gặp nhiều khó khăn, nhưng Joy không từ bỏ. Tiệm thu gọn quy mô để chuẩn bị cho một khởi đầu mới kiên cường hơn.",
    silhouette: "silhouette_comeback",
    endlessModifierDescription:
      "Bắt đầu chế độ Comeback giữ lại các công thức và bài học kinh nghiệm quý giá.",
  },
};

export const ENDING_THRESHOLDS = {
  perfect: {
    maxRemainingDebt: 0,
    minReputation: 4.5,
    minNeighborhoodTrust: 75,
    minBookAccuracy: 80,
    minFamilyTrust: 70,
    minHusbandConfidence: 70,
    minJdTrust: 70,
  },
  family: {
    maxRemainingDebt: 0,
    minFamilyTrust: 85,
    minHusbandConfidence: 85,
    minJdTrust: 75,
  },
  jd: {
    maxRemainingDebt: 0,
    minJdTrust: 85,
    minJdStamina: 50,
    minJdMood: 60,
  },
  neighborhood: {
    maxDebtRatio: 0.10, // 90%+ paid
    minNeighborhoodTrust: 85,
    minReputation: 4.5,
  },
  husbandFinance: {
    minReputation: 2.5,
  },
};
