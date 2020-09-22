export interface IServerToken {
    user: {
        id: string;
        login: string;
        password: string;
        visibleName: string;
        email: string;
        tokens: object;
    };
  }