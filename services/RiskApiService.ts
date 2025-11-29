import { api } from '@/utils/apiClient';

export interface RiskAssessmentData {
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string;
  timeHorizon: string;
  financialSituation: string;
}

export interface RiskAssessmentResponse {
  success: boolean;
  message?: string;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  riskScore?: number;
  recommendations?: string[];
}

export interface RiskProfileResponse {
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  riskScore: number;
  assessmentDate: string;
  recommendations: string[];
}

/**
 * Submit risk assessment answers to backend
 */
export const submitRiskAssessment = async (
  answers: RiskAssessmentData
): Promise<RiskAssessmentResponse> => {
  try {
    const response = await api.post<RiskAssessmentResponse>(
      '/api/risk-assessment/submit',
      answers
    );
    return response.data;
  } catch (error: any) {
    console.error('Risk assessment submission failed:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to submit risk assessment',
      error,
    };
  }
};

/**
 * Get current risk profile
 */
export const getRiskProfile = async (): Promise<RiskProfileResponse> => {
  try {
    const response = await api.get<RiskProfileResponse>('/api/risk-assessment/profile');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch risk profile:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch risk profile',
      error,
    };
  }
};

/**
 * Update risk assessment
 */
export const updateRiskAssessment = async (
  answers: RiskAssessmentData
): Promise<RiskAssessmentResponse> => {
  try {
    const response = await api.put<RiskAssessmentResponse>(
      '/api/risk-assessment/update',
      answers
    );
    return response.data;
  } catch (error: any) {
    console.error('Risk assessment update failed:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to update risk assessment',
      error,
    };
  }
};
