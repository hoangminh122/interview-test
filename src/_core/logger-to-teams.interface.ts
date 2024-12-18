import { Request } from 'express';

export interface ILogToTeamsService {
    postMessageToDevopsTeams?(
        messageDetail: { api: string; message: string; title?: string },
        req?: Request,
    ): Promise<void>;
    postMessageToPublicTeams(
        messageDetail: { api: string; message: string; title?: string },
        req?: Request,
    ): Promise<void>;
}
