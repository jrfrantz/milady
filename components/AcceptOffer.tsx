import { Signer } from 'ethers'
import { acceptOffer, Execute, paths } from '@reservoir0x/client-sdk'
import React, { ComponentProps, FC, useEffect, useState } from 'react'
import { SWRResponse } from 'swr'
import * as Dialog from '@radix-ui/react-dialog'
import ModalCard from './modal/ModalCard'
import { useConnect } from 'wagmi'
import Toast from './Toast'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import { getDetails } from 'lib/fetch/fetch'
import { CgSpinner } from 'react-icons/cg'

type Details = paths['/tokens/details/v2']['get']['responses']['200']['schema']
type Collection = paths['/collection/v1']['get']['responses']['200']['schema']

type Props = {
  apiBase: string
  data:
    | {
        details: SWRResponse<Details, any>
        collection: Collection | undefined
      }
    | {
        contract: string | undefined
        tokenId: string | undefined
      }
  isInTheWrongNetwork: boolean | undefined
  mutate?: SWRResponse['mutate'] | SWRInfiniteResponse['mutate']
  setToast: (data: ComponentProps<typeof Toast>['data']) => any
  show: boolean
  signer: Signer | undefined
}

const AcceptOffer: FC<Props> = ({
  isInTheWrongNetwork,
  apiBase,
  mutate,
  data,
  signer,
  show,
  setToast,
}) => {
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [{ data: connectData }, connect] = useConnect()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [open, setOpen] = useState(false)

  // Data from props
  const [collection, setCollection] = useState<Collection>()
  const [details, setDetails] = useState<SWRResponse<Details, any> | Details>()

  useEffect(() => {
    if (data && open) {
      // Load data if missing
      if ('tokenId' in data) {
        getDetails(apiBase, data.contract, data.tokenId, setDetails)
      }
      // Load data if provided
      if ('details' in data) {
        setDetails(data.details)
        setCollection(data.collection)
      }
    }
  }, [data, open])

  let tokenId: string | undefined = undefined
  let contract: string | undefined = undefined

  if ('tokenId' in data) {
    tokenId = data.tokenId
    contract = data.contract
  }

  if ('details' in data) {
    tokenId = data.details.data?.tokens?.[0].token?.tokenId
    contract = data.details.data?.tokens?.[0].token?.contract
  }

  // Set the token either from SWR or fetch
  let token: NonNullable<Details['tokens']>[0] = { token: undefined }

  let topBuyValueExists = false

  // From fetch
  if (details && 'tokens' in details && details.tokens?.[0]) {
    token = details.tokens?.[0]
  }

  // From SWR
  if (details && 'data' in details && details?.data?.tokens?.[0]) {
    token = details.data?.tokens?.[0]
    topBuyValueExists = !token?.market?.topBid?.value
  }

  const modalData = {
    collection: {
      name: collection?.collection?.name,
    },
    token: {
      contract: token?.token?.contract,
      id: token?.token?.tokenId,
      image: token?.token?.image,
      name: token?.token?.name,
      topBuyValue: token?.market?.topBid?.value,
      floorSellValue: token?.market?.floorAsk?.price,
    },
  }

  const handleError: Parameters<typeof acceptOffer>[0]['handleError'] = (
    err
  ) => {
    setOpen(false)
    setSteps(undefined)
    // Handle user rejection
    if (err?.code === 4001) {
      setToast({
        kind: 'error',
        message: 'You have canceled the transaction.',
        title: 'User canceled transaction',
      })
      return
    }
    setToast({
      kind: 'error',
      message: 'The transaction was not completed.',
      title: 'Could not accept offer',
    })
  }

  const handleSuccess: Parameters<
    typeof acceptOffer
  >[0]['handleSuccess'] = () => {
    details && 'mutate' in details && details.mutate()
    mutate && mutate()
  }

  const checkWallet = async () => {
    if (!signer) {
      const data = await connect(connectData.connectors[0])
      if (data?.data) {
        setToast({
          kind: 'success',
          message: 'Connected your wallet successfully.',
          title: 'Wallet connected',
        })
      }
    }
  }

  let tokenString: string | undefined = undefined

  if (contract && tokenId) {
    tokenString = `${contract}:${tokenId}`
  }
  if (token?.token?.contract && token?.token?.tokenId) {
    tokenString = `${token?.token?.contract}:${token?.token?.tokenId}`
  }

  const execute = async () => {
    await checkWallet()

    setWaitingTx(true)
    await acceptOffer({
      apiBase,
      token: tokenString,
      // contract: contract || token?.token?.contract,
      setState: setSteps,
      signer,
      handleSuccess,
      handleError,
    })
    setWaitingTx(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {show && (
        <Dialog.Trigger
          disabled={waitingTx || topBuyValueExists || isInTheWrongNetwork}
          onClick={execute}
          className="buy-button-outline w-full"
        >
          {waitingTx ? (
            <CgSpinner className="h-4 w-4 animate-spin" />
          ) : (
            'Accept Offer'
          )}
        </Dialog.Trigger>
      )}
      {steps && (
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard title="Accept Offer" loading={waitingTx} steps={steps} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}

export default AcceptOffer
