// Fellowship types/interfaces 

export type FellowshipStatus = "active" | "closed" | "upcoming" | "cancelled";
export type FellowshipCategory =
  | "merit"
  | "need-based"
  | "research"
  | "sports"
  | "cultural"
  | "other";

export interface Fellowship {
  _id: string;
  name: string;
  description: string;
  eligibility: string;
  amount: number;
  duration: string;
  applicationDeadline: string;
  requiredDocuments: string[];
  category: FellowshipCategory;
  minCGPA?: number;
  eligibleSemesters?: number[];
  eligibleDepartments?: string[];
  maxApplicants?: number | null;
  totalSlots?: number | null;
  status: FellowshipStatus;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  lastUpdatedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isApplicationOpen?: boolean;
  daysRemaining?: number;
  applicationCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type FellowshipApplicationStatus =
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface FellowshipApplication {
  _id: string;
  fellowship: Fellowship | string;
  student: {
    _id: string;
    name: string;
    email: string;
    studentId: string;
    department: string;
    semester: number;
    cgpa: number;
  };
  applicationData: {
    personalStatement: string;
    whyApplying: string;
    achievements?: string;
    futureGoals?: string;
  };
  documents: Array<{
    name: string;
    url: string;
    uploadDate?: string;
  }>;
  status: FellowshipApplicationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  adminRemarks?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
