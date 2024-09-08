// Customer interface se zakladnimi udaji
export interface CustomerBasic {
  id: string;
  name: string;
}

// Customer interface se vsemi udaji
export interface CustomerDetailed extends CustomerBasic {
  email: string;
  address: string;
}
