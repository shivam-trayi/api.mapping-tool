// Types for mapping
export interface QualificationsMappingData {
  qualification_id: number;          // refers to qualifications.id
  member_id: number;
  member_type: string;
  member_qualification_id?: number;  // partner qualification id
  created_by?: number;
  updated_by?: number;
  old_member_qualification_id?: number;
  constantId ?: number; // Optional constantId field
}

export interface CreateMappingResponse {
  status: number;
  success: boolean;
}
