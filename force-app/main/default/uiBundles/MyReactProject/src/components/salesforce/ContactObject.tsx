import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContacts } from '@/store/slices/ContactsSlice';

export default function ContactObjectTable() {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (records.length === 0) {
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
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Lead Source
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {records.map((record, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {record.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {record.leadSource}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className=" py-4">
        <p className="text-sm text-gray-500 mt-1">
          Showing the first {records.length} records
        </p>
      </div>
    </div>
  );
}