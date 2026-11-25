// Sample destination address used to pre-fill the test order form (demo only).

export interface CustomerAddress {
  name: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const sampleAddress: CustomerAddress = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  addressLine1: "1234 Market Street",
  addressLine2: "Apt 5B",
  city: "San Francisco",
  state: "CA",
  postalCode: "94103",
  country: "United States",
};
