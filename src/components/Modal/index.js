/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'

export default ({
  showModal,
  handleCloseModal,
  children,
  showButton = true,
  handleModalSave,
  modalLoading,
  modalId
}) => {
  return (
    <CModal show={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          {modalId === '' ? 'Novo Registro' : 'Editar Registro'}
        </CModalHeader>
        <CModalBody>
          {children}
        </CModalBody>
        <CModalFooter>
         {showButton && (
            <CButton
              color="primary"
              onClick={handleModalSave}
              disabled={modalLoading}
            >
                {modalLoading ? 'Carregando...' : 'Salvar'}
            </CButton>
         )}
          <CButton
            color="secondary"
            onClick={handleCloseModal}
            disabled={modalLoading}
          >
              Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
  )
}
