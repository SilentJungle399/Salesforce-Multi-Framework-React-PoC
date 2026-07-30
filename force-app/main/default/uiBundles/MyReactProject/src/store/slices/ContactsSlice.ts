import { createSalesforceObjectCollection } from '@/store/salesforce/objectCollection';
import type { SalesforceObjectQueryResult } from '@/store/salesforce/types';

export interface ContactRecord {
  name: string;
  phone: string;
  leadSource: string;
  title: string;
  department: string;
  email: string;
  languages: string;
}

interface ContactNode {
  Name: { value: string };
  Phone: { value: string };
  LeadSource: { value: string };
  Title: { value: string };
  Department: { value: string };
  Email: { value: string };
  Languages__c: { value: string };
}

type ContactQueryResult = SalesforceObjectQueryResult<'Contact', ContactNode>;

const OBJECT_QUERY = `
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
              Title {
                value
              }
              Department {
                value
              }
              Email {
                value
              }
              Languages__c {
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
  query: OBJECT_QUERY,
  fallbackErrorMessage: 'Failed to fetch contacts',
  selectRecords: (data) =>
     data.uiapi.query.Contact.edges.map((edge) => ({
      name: edge.node.Name.value,
      phone: edge.node.Phone.value,
      leadSource: edge.node.LeadSource.value,
      title: edge.node.Title.value,
      department: edge.node.Department.value,
      email: edge.node.Email.value,
      languages: edge.node.Languages__c.value,
    }))
});

export const { fetchRecords: fetchContacts } = ContactCollection;
export const { clearError, resetCollection, setRecords } =
  ContactCollection.actions;
export default ContactCollection.reducer;
