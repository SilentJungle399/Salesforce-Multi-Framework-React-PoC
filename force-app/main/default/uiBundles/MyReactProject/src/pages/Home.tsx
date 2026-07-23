import TestObject from '@/components/salesforce/TestNewObject';
import Contacts from '@/components/salesforce/ContactObject';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Object items</h1>
      </div> */}
      
        <TestObject />
        <Contacts />
    </div>
  );
}
