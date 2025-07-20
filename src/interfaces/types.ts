export interface User {
  id: number;
  name: string;
  role: string;
}

export interface SampleData {
  message: string;
  data: User[];
}
