import { createSalesforceObjectCollection } from '@/store/salesforce/objectCollection';
import type { SalesforceObjectQueryResult } from '@/store/salesforce/types';

export interface AccountRecord {
  name: string;
  accountNumber: string;
  rating: string;
  phone: string;
  type: string;
  ownership: string;
  industry: string;
  numberOfEmployees: number;
  annualRevenue: number;
}

interface AccountNode {
  Name: { value: string };
  AccountNumber: { value: string };
  Rating: { value: string };
  Phone: { value: string };
  Type: { value: string };
  Ownership: { value: string };
  Industry: { value: string };
  NumberOfEmployees: { value: number };
  AnnualRevenue: { value: number };
}

type AccountQueryResult = SalesforceObjectQueryResult<'Account', AccountNode>;

const TEST_OBJECT_QUERY = `
  query GetAccounts {
    uiapi {
      query {
        Account(first: 10) {
          edges {
            node {
              Name {
                value
              }
              AccountNumber {
                value
              }
              Rating {
                value
              }
              Phone {
                value
              }
              Type {
                value
              }
              Ownership {
                value
              }
              Industry {
                value
              }
              NumberOfEmployees {
                value
              }
              AnnualRevenue {
                value
              }
            }
          }
        }
      }
    }
  }
`;

const AccountCollection = createSalesforceObjectCollection<
  AccountRecord,
  AccountQueryResult
>({
  sliceName: 'Accounts',
  query: TEST_OBJECT_QUERY,
  fallbackErrorMessage: 'Failed to fetch Accounts',
  selectRecords: (data) =>
    data.uiapi.query.Account.edges.map((edge) => ({
      name: edge.node.Name.value,
      accountNumber: edge.node.AccountNumber.value,
      rating: edge.node.Rating.value,
      phone: edge.node.Phone.value,
      type: edge.node.Type.value,
      ownership: edge.node.Ownership.value,
      industry: edge.node.Industry.value,
      numberOfEmployees: edge.node.NumberOfEmployees.value,
      annualRevenue: edge.node.AnnualRevenue.value,
    })),
});

export const { fetchRecords: fetchAccounts } = AccountCollection;
export const { clearError, resetCollection, setRecords } =
  AccountCollection.actions;
export default AccountCollection.reducer;
