import bookingApiRequest from '@/apiRequests/booking';
import accountApiRequest from '@/apiRequests/user';
import ProfileForm from '@/components/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cookies } from 'next/headers';

export default async function MyInfoPage() {
  const accessToken = cookies().get('accessToken');
  const accountResponse = await accountApiRequest.myInfo(accessToken?.value ?? '');

  const bookingResponse = await bookingApiRequest.getBookingByUserId(accountResponse.payload.data.userId, accessToken?.value ?? '');
  const bookings = bookingResponse.payload.data;

  return (
    <div className='bg-gray-100 dark:bg-gray-900 h-screen'>
      <Tabs defaultValue="history" className="mx-auto pt-4 my-0">
        <TabsList className="grid grid-cols-2 max-w-xl mx-auto">
          <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <div className='flex justify-center'>
            {bookings.length > 0
              ? (
                <></>
              )
              : (
                <h3 className='text-center text-sm font-normal not-italic text-gray-400'>Chưa có giao dịch nào</h3>
              )
            }
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <div className='flex justify-center'>
            <ProfileForm profile={accountResponse.payload.data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
