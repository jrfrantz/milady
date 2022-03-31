import EthAccount from 'components/EthAccount'
import Layout from 'components/Layout'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import useDataDog from 'hooks/useAnalytics'
import getMode from 'lib/getMode'
import * as Tabs from '@radix-ui/react-tabs'
import { toggleOnItem } from 'lib/router'
import useUserTokens from 'hooks/useUserTokens'
import useUserActivity from 'hooks/useUserActivity'
import useUserPositions from 'hooks/useUserPositions'
import UserOffersTable from 'components/tables/UserOffersTable'
import UserListingsTable from 'components/tables/UserListingsTable'
import UserActivityTable from 'components/tables/UserActivityTable'
import UserTokensTable from 'components/tables/UserTokensTable'
import { ComponentProps } from 'react'
import Toast from 'components/Toast'
import toast from 'react-hot-toast'
import Head from 'next/head'

// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
const apiBase = process.env.NEXT_PUBLIC_API_BASE

// OPTIONAL
const collectionEnv = process.env.NEXT_PUBLIC_COLLECTION
const communityEnv = process.env.NEXT_PUBLIC_COMMUNITY

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Address: NextPage<Props> = ({ mode, collectionId }) => {
  const [{ data: accountData }] = useAccount()
  const [{ data: network }] = useNetwork()
  const [{ data: signer }] = useSigner()
  const router = useRouter()
  useDataDog(accountData)
  const address = router.query?.address?.toString()?.toLowerCase()
  //const userTokens = useUserTokens(apiBase, collectionId, [], mode, address)
  const userTokens = useUserTokens(apiBase, "0x5af0d9827e0c53e4799bb226655a1de152a425a5", [], mode, address)
  // const userActivity = useUserActivity(apiBase, [], address)
  const sellPositions = useUserPositions(apiBase, [], 'sell', address)
  const buyPositions = useUserPositions(apiBase, [], 'buy', address)

  if (!apiBase || !chainId) {
    console.debug({ apiBase, chainId })
    return <div>There was an error</div>
  }

  const setToast: (data: ComponentProps<typeof Toast>['data']) => any = (
    data
  ) => toast.custom((t) => <Toast t={t} toast={toast} data={data} />)

  const isInTheWrongNetwork = network.chain?.id !== +chainId
  const isOwner = address?.toLowerCase() === accountData?.address?.toLowerCase()

  let tabs = [
    { name: 'Portfolio', id: 'portfolio' },
    // { name: 'History', id: 'history' },
  ]

  if (isOwner) {
    tabs = [
      { name: 'Portfolio', id: 'portfolio' },
      { name: 'Buying', id: 'buying' },
      { name: 'Selling', id: 'selling' },
      // { name: 'History', id: 'history' },
    ]
  }

  return (
    <Layout>
      <Head>
        <title>{address} Profile</title>
      </Head>
      <div className="col-span-full mt-4 mb-10 justify-self-center">
        {address && <EthAccount address={address} />}
      </div>
      <Tabs.Root
        value={router.query?.tab?.toString() || 'portfolio'}
        className="col-span-full grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12"
      >
        <Tabs.List className="col-span-full mb-4 flex overflow-hidden rounded-lg shadow md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-5">
          {tabs.map(({ name, id }) => (
            <Tabs.Trigger
              key={id}
              id={id}
              value={id}
              className={
                'group reservoir-label-l relative w-full min-w-0 whitespace-nowrap border-b-2 border-transparent bg-white py-4 px-12 text-center hover:bg-gray-50 hover:text-gray-700 focus:z-10 radix-state-active:border-black radix-state-active:text-gray-900'
              }
              onClick={() => toggleOnItem(router, 'tab', id)}
            >
              <span>{name}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="col-span-full justify-self-center">
          <p className='text-[#2f4d0c]'>List here with no platform fee and optionally list on Opensea, too. Listings are gasless.</p>
        </div>
        <Tabs.Content value="portfolio" className="col-span-full">
          <UserTokensTable
            data={userTokens}
            mutate={() => {
              buyPositions.positions.mutate()
              userTokens.tokens.mutate()
              // userActivity.transfers.mutate()
              sellPositions.positions.mutate()
            }}
            isOwner={isOwner}
            modal={{
              accountData,
              apiBase,
              isInTheWrongNetwork,
              collectionId,
              setToast,
              signer,
            }}
          />
          {/* <UserTokensGrid data={userTokens} /> */}
        </Tabs.Content>
        <Tabs.Content value="history" className="col-span-full">
          {/* <UserActivityTable
            data={userActivity}
            chainId={+chainId as ChainId}
          /> */}
        </Tabs.Content>
        {isOwner && (
          <>
            <Tabs.Content value="buying" className="col-span-full">
              <UserOffersTable
                data={buyPositions}
                mutate={() => {
                  buyPositions.positions.mutate()
                  userTokens.tokens.mutate()
                }}
                isOwner={isOwner}
                maker={address || ''}
                modal={{
                  accountData,
                  apiBase,
                  isInTheWrongNetwork,
                  collectionId,
                  setToast,
                  signer,
                }}
              />
            </Tabs.Content>
            <Tabs.Content value="selling" className="col-span-full">
              <UserListingsTable
                data={sellPositions}
                mutate={() => {
                  userTokens.tokens.mutate()
                  sellPositions.positions.mutate()
                }}
                isOwner={isOwner}
                maker={address || ''}
                modal={{
                  accountData,
                  apiBase,
                  isInTheWrongNetwork,
                  collectionId,
                  setToast,
                  signer,
                }}
              />
            </Tabs.Content>
          </>
        )}
      </Tabs.Root>
    </Layout>
  )
}

export default Address

export const getServerSideProps: GetServerSideProps<{
  mode: string
  collectionId: string
}> = async ({ req }) => {
  const { collectionId, mode } = getMode(req, communityEnv, collectionEnv)

  return { props: { collectionId, mode } }
}
