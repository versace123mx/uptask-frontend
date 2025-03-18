import { Project, TeamMember } from "../types";

export const isManager = (mangerId: Project['manger'], userId: TeamMember['_id']) => mangerId === userId