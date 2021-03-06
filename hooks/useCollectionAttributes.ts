import { paths } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { NextRouter } from 'next/router'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'

type Attributes =
  paths['/collections/{collection}/attributes/explore/v1']['get']['responses']['200']['schema']

export default function useCollectionAttributes(
  apiBase: string | undefined,
  router: NextRouter,
  collectionId: string | undefined
) {
  const { ref, inView } = useInView()

  function getUrl() {
    if (!collectionId) return undefined

    const url = new URL(
      `/collections/${router.query.id || collectionId}/attributes/explore/v1`,
      apiBase
    )

    return url
  }

  const url = getUrl()

  const collectionAttributes = useSWRInfinite<Attributes>(
    (index, previousPageData) => getKey(url, router, index, previousPageData),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  )

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      collectionAttributes.setSize(collectionAttributes.size + 1)
    }
  }, [inView])

  return { collectionAttributes, ref }
}

const getKey: (
  url: URL | undefined,
  router: NextRouter,
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader> = (
  url: URL | undefined,
  router: NextRouter,
  index: number,
  previousPageData: Attributes
) => {
  // Reached the end
  if (previousPageData && previousPageData?.attributes?.length === 0) {
    return null
  }

  if (!url) return null

  let query: paths['/collections/{collection}/attributes/explore/v1']['get']['parameters']['query'] =
    { limit: 20, offset: index * 20 }

  // Convert the client sort query into the API sort query
  if (router.query?.sort) {
    if (`${router.query?.sort}` === 'best_offer') {
      query.sortBy = 'topBidValue'
    }

    // if (`${router.query?.sort}` === 'name') {
    //   query.sortBy = 'value'
    // }
  } else {
    query.sortBy = 'floorAskPrice'
  }

  if (router.query.attribute_key) {
    query.attributeKey = router.query.attribute_key.toString()
  }

  setParams(url, query)

  return url.href
}
