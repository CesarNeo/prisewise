'use client'

import { addUserEmailToProduct } from '@/lib/actions'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { ElementRef, FormEvent, Fragment, useRef, useState } from 'react'

type Props = {
  productId: string
}

function Modal({ productId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputEmailRef = useRef<ElementRef<'input'>>(null)

  function handleOpenModal() {
    setIsOpen(true)
  }

  function handleCloseModal() {
    setIsOpen(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const inputEmail = inputEmailRef.current

    if (!inputEmail) return

    setIsSubmitting(true)

    await addUserEmailToProduct(productId, inputEmail.value)

    setIsSubmitting(false)
    inputEmail.value = ''
    handleCloseModal()
  }

  return (
    <>
      <button type="button" className="btn" onClick={handleOpenModal}>
        Acompanhar Preço
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={handleCloseModal}
          className="dialog-container"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-280"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="Close"
                      width={24}
                      height={24}
                      onClick={handleCloseModal}
                      className="cursor-pointer"
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Fique atualizado com alertas de preços de produtos direto na
                    sua caixa de entrada!
                  </h4>

                  <p className="text-sm text-gray-600 mt-2">
                    Nunca mais perca uma promoção com nossos alertas!
                  </p>

                  <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Endereço de e-mail
                    </label>

                    <div className="dialog-input_container">
                      <Image
                        src="/assets/icons/mail.svg"
                        alt="Mail"
                        width={18}
                        height={18}
                      />

                      <input
                        ref={inputEmailRef}
                        type="email"
                        id="email"
                        placeholder="Digite seu endereço de e-mail"
                        required
                        className="dialog-input"
                      />
                    </div>

                    <button
                      type="submit"
                      className="dialog-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Acompanhar'}
                    </button>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal
