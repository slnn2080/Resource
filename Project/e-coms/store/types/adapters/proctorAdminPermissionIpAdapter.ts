/* eslint-disable camelcase */

export class ProctorAdminPermissionIpAdapter {
    constructor(
      public status: number = 0,                               
      public process: string = "",                               
      public message: { code: string; message: string }[] = [] 
    ) {}
  }
  
  export type ProctorAdminPermissionIpRequestType = {
  };
  
  type ProctorAdminPermissionIpType = {
    status: number;
    process: string;
    messages: { code: string; message: string }[];
  };
  
  export type ProctorAdminPermissionIpResponseType = {
    status: number;
    result: ProctorAdminPermissionIpType;
    message: string;
  };
  