import movieApiRequest from "@/apiRequests/movie";

export default async function Home() {

  // const nowShowingRes = await movieApiRequest.getNowShowingList();
  // const comingSoonRes = await movieApiRequest.getComingSoonList();

  // const nowShowingList = nowShowingRes.payload.data;
  // const comingSoonList = comingSoonRes.payload.data;

  return (
    <main className="text-4xl font-thin text-center">
      Hello
    </main>
  );
}
