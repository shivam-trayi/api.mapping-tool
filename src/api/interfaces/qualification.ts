// Types for mapping
export interface QualificationsMappingData {
  qualification_id: number;
  member_id: number;
  member_type: string;
  member_qualification_id?: number;
  created_by?: number;
  updated_by?: number;
  old_member_qualification_id?: number;
  constantId?: number;
}

export interface CreateMappingResponse {
  status: number;
  success: boolean;
}


export interface UpdateConstantMappingReviewPayload {
  memberId: number;
  memberType: string;
  optionData: Array<{
    questionId: number;
    qualificationId: number;
    memberQuestionId: number;
  }>;
}


export interface UpdateConstantMappingReviewDaoPayload {
  memberId: number;
  memberType: string;
  optionData: Array<{
    questionId: number;
    memberQuestionId: string | number | null;
  }>;
}



// // =======================
// // Request Payload Types
// // =======================
// export interface QualificationReviewUpdateItem {
//   qualificationId: number;
//   memberQualificationId: number | null;
// }

// export interface QualificationReviewUpdatePayload {
//   memberId: number;
//   memberType: string;
//   optionData: QualificationReviewUpdateItem[];
// }

// // =======================
// // Response Types
// // =======================
// export interface QualificationReviewUpdateResult {
//   qualificationId: number;
//   success: boolean;
//   rowsAffected?: number;
//   error?: string;
// }

// export interface QualificationReviewUpdateResponse {
//   success: boolean;
//   message: string;
//   affectedRows: number;
//   results: QualificationReviewUpdateResult[];
// }


// Request payload
export interface QualificationConstantUpdateItem {
  qualificationId: number;
  constantId: string | number | null;
  memberId: number;
}

export interface QualificationConstantUpdatePayload {
  bodyData: QualificationConstantUpdateItem[];
}

// Response structure
// export interface QualificationConstantUpdateResult {
//   qualificationId: number;
//   success: boolean;
//   rowsAffected?: number;
//   error?: string;
// }

// export interface QualificationConstantUpdateResponse {
//   success: boolean;
//   message: string;
//   affectedRows: number;
//   results: QualificationConstantUpdateResult[];
// }


export interface UpdateQualificationConstantPayload {
  id: number; // primary key from the table
  member_qualification_id: number | null;
}

// export interface UpdateQualificationConstantResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   affectedRows?: number;
//   results?: any[];
// }