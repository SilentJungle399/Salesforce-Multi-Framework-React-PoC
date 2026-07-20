import { useEffect, useState } from 'react';
import { createDataSDK, gql } from '@salesforce/sdk-data';

const QUERY = gql`
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

interface QueryResponse {
  uiapi: {
    query: {
      TestObject__c: {
        edges: {
          node: {
            Name__c: { value: string };
            Test_value__c: { value: string };
            Address__c: { value: string };
          };
        }[];
      };
    };
  };
}

interface Contact {
  name: string;
  testval: string;
  address: string;
}

export default function TestObjectTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sdk = await createDataSDK();

        const response = await sdk.graphql!({
          query: QUERY,
        });

        const data = response.data as QueryResponse;

        const records =
          data.uiapi.query.TestObject__c.edges.map((edge) => ({
            name: edge.node.Name__c.value,
            testval: edge.node.Test_value__c.value,
            address: edge.node.Address__c.value,
          })) ?? [];

        setContacts(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (contacts.length === 0) return <p>No records found.</p>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No records found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Test Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Address
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {contacts.map((contact, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {contact.testval}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {contact.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className=" py-4">
        <p className="text-sm text-gray-500 mt-1">
          Showing the first {contacts.length} records
        </p>
      </div>
    </div>
  );
}