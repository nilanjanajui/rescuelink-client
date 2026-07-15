export type DisasterType =
  'flood' | 'earthquake' | 'fire' | 'cyclone' | 'other';
export type Urgency = 'critical' | 'moderate' | 'low';
export type MissionStatus = 'active' | 'resolved';

export interface Mission {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  disasterType: DisasterType;
  urgency: Urgency;
  status: MissionStatus;
  location: string;
  volunteersNeeded: number;
  volunteersJoined: number;
  imageUrl: string;
  images: string[];
  postedBy: string;
  createdAt: string;
  updatedAt: string;

  posterName?: string;
}

export interface MissionUpdate {
  _id: string;
  missionId: string;
  userId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
}

export interface JoinedMission {
    missionId: string;
    joinedAt: string;
    mission: Mission;
}

export interface DashboardData {
    missionsJoinedCount: number;
    recentJoinedMissions: JoinedMission[];
    missionsPostedCount: number;
    recentPostedMissions: Mission[];
    platform?: {
        totalMissions: number;
        totalVolunteers: number;
        successRate: number;
    };
}