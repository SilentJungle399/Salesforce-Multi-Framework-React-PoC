import { createSalesforceObjectCollection } from '@/store/salesforce/objectCollection';
import type { SalesforceObjectQueryResult } from '@/store/salesforce/types';

export interface TestObjectRecord {
  name: string;
  testValue: string;
  address: string;
}

interface TestObjectNode {
  Name__c: { value: string };
  Test_value__c: { value: string };
  Address__c: { value: string };
}

type TestObjectQueryResult = SalesforceObjectQueryResult<'TestObject__c', TestObjectNode>;

const OBJECT_QUERY = `
  query GetTestObjects {
    uiapi {
      query {
        TestObject__c(first: 10) {
          edges {
            node {
              Name__c {
                value
              }
              Test_value__c {
                value
              }
              Address__c {
                value
              }
            }
          }
        }
      }
    }
  }
`;

const testObjectCollection = createSalesforceObjectCollection<
  TestObjectRecord,
  TestObjectQueryResult
>({
  sliceName: 'testObjects',
  query: OBJECT_QUERY,
  fallbackErrorMessage: 'Failed to fetch test objects',
  selectRecords: (data) =>
    data.uiapi.query.TestObject__c.edges.map((edge) => ({
      name: edge.node.Name__c.value,
      testValue: edge.node.Test_value__c.value,
      address: edge.node.Address__c.value,
    })),
});

export const { fetchRecords: fetchTestObjects } = testObjectCollection;
export const { clearError, resetCollection, setRecords } =
  testObjectCollection.actions;
export default testObjectCollection.reducer;
