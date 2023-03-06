import { useAuthState } from "../context/auth";
import { Post, Sub } from "../types";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";

export default function Home() {
  const { authenticated } = useAuthState();

  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = `/subs/sub/topSubs`;
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  // 무한스크롤로 포스트를 불러오기 위한 함수
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  // 스크롤을 내려서 observedPost에 닿으면
  // 다음 페이지 포스트들을 가져오기 위한 id state
  const [observedPost, setObservedPost] = useState("");

  // 무한 스크롤 기능 구현
  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length === 0) return;
    // posts 배열 안에 마지막 post의 id를 가져오기
    const id = posts[posts.length - 1].identifier;
    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막 post를 observedPost로
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    // 브라우저 ViewPort와 설정한 요소의 교차점을 관찰
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태(Boolean)
        if (entries[0].isIntersecting) {
          console.log("마지막 포스트에 도착");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    // 대상 요소의 관찰을 시작
    observer.observe(element);
  };

  return <div>asdfasf</div>;
}
