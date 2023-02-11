import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

const SubPage = () => {
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const router = useRouter();
  const subName = router.query.sub;
  const {
    data: sub,
    error,
    mutate,
  } = useSWR(subName ? `/subs/${subName}` : null);

  return <div>sub 상세페이지</div>;
};

export default SubPage;
