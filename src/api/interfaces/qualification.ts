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
  affectedRows?: number; // optional if it may not exist

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

export interface QualificationConstantUpdateItem {
  qualificationId: number;
  constantId: string | number | null;
  memberId: number;
}

export interface QualificationConstantUpdatePayload {
  bodyData: QualificationConstantUpdateItem[];
}

export interface UpdateQualificationConstantPayload {
  id: number;
  member_qualification_id: number | null;
};