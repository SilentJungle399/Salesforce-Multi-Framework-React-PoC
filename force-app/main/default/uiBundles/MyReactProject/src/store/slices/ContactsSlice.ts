import { createSalesforceObjectCollection } from '@/store/salesforce/objectCollection';
import type { SalesforceObjectQueryResult } from '@/store/salesforce/types';

export interface ContactRecord {
  name: string;
  phone: string;
  leadSource: string;
}

interface ContactNode {
  Name: { value: string };
  Phone: { value: string };
  LeadSource: { value: string };
}

type ContactQueryResult = SalesforceObjectQueryResult<'Contact', ContactNode>;

const TEST_OBJECT_QUERY = `
  query GetContacts {
    uiapi {
      query {
        Contact(first: 10) {
          edges {
            node {
              Name {
                value
              }
              Phone {
                value
              }
              LeadSource {
                value
              }
            }
          }
        }
      }
    }
  }
`;

const ContactCollection = createSalesforceObjectCollection<
  ContactRecord,
  ContactQueryResult
>({
  sliceName: 'Contacts',
  query: TEST_OBJECT_QUERY,
  fallbackErrorMessage: 'Failed to fetch contacts',
  selectRecords: (data) =>
    data.uiapi.query.Contact.edges.map((edge) => ({
      name: edge.node.Name.value,
      phone: edge.node.Phone.value,
      leadSource: edge.node.LeadSource.value,
    })),
});

export const { fetchRecords: fetchContacts } = ContactCollection;
export const { clearError, resetCollection, setRecords } =
  ContactCollection.actions;
export default ContactCollection.reducer;
