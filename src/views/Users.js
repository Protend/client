/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CDataTable,
  CButtonGroup,
  CFormGroup,
  CLabel,
  CInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import Modal from 'src/components/Modal'

import useApi from '../services/api'

export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalId, setModalId] = useState('')
  const [modalNameField, setModalNameField] = useState('')
  const [modalEmailField, setModalEmailField] = useState('')
  const [modalCpfField, setModalCpfField] = useState('')
  const [modalPasswordField, setModalPasswordField] = useState('')
  const [modalConfirmPasswordField, setModalConfirmPasswordField] = useState('')

  const fields = [
    { label: 'Nome', key: 'name', sorter: false },
    { label: 'E-mail', key: 'email', sorter: false },
    { label: 'CPF', key: 'cpf' },
    { label: 'Ações', key: 'actions', _style: { width: '1px' }, sorter: false, filter: false }
  ]

  useEffect(() => {
    getList()
  }, [])


  const getList = async () => {
    setLoading(true)
    const result = await api.getUsers()
    setLoading(false)
    if (result.error === '') {
      setList(result.list)
    } else {
      alert(result.error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (id) => {
    let index = list.findIndex(v => v.id === id)

    setModalId(list[index]['id'])
    setModalNameField(list[index]['name'])
    setModalEmailField(list[index]['email'])
    setModalCpfField(list[index]['cpf'])
    setModalPasswordField('')
    setModalConfirmPasswordField('')
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalNameField && modalEmailField && modalCpfField) {
      setModalLoading(true)

      let result
      let data = {
        name: modalNameField,
        email: modalEmailField,
        cpf: modalCpfField
      }

      if (modalPasswordField) {
        if (modalPasswordField === modalConfirmPasswordField) {
          data.password = modalPasswordField
        } else {
          alert('Whoops: As senhas estão incorretas!')
          setModalLoading(false)
        }
      }

      if (modalId === '') {
        result = await api.addUser(data)
      } else {
        result = await api.updateUser(modalId, data)
      }
      setModalLoading(false)

      if (result.error === '') {
        setShowModal(false)
        getList()
      }
    } else {
      alert('Whoops: Todos os campos são obrigátorio!')
    }
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeUser(list[index]['id'])

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handleNewButton = () => {
    setModalId('')
    setModalNameField('')
    setModalEmailField('')
    setModalCpfField('')
    setModalPasswordField('')
    setModalConfirmPasswordField('')
    setShowModal(true)
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Usuários</h2>

          <CCard>
            <CCardHeader>
              <CButton
                color="primary"
                onClick={handleNewButton}
              >
                <CIcon name="cil-check" /> Novo Usuário
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                columnFilter
                sorter
                hover
                striped
                bordered
                pagination
                itemsPerPage={10}
                scopedSlots={{
                  'actions': (item, index) => (
                    <td>
                      <CButtonGroup>
                        <CButton
                          color="info"
                          onClick={() => handleEditButton(item.id)}
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => handleRemoveButton(index)}
                        >
                          Excluir
                        </CButton>
                      </CButtonGroup>
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleModalSave={handleModalSave}
        modalLoading={modalLoading}
        modalId={modalId}
      >

        <CFormGroup>
          <CLabel htmlFor="modal-date">Nome</CLabel>
          <CInput
            type="text"
            id="modal-date"
            disabled={modalLoading}
            value={modalNameField}
            onChange={(e) => setModalNameField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-email">E-mail</CLabel>
          <CInput
            type="email"
            id="modal-email"
            disabled={modalLoading}
            value={modalEmailField}
            onChange={(e) => setModalEmailField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-cpf">CPF</CLabel>
          <CInput
            type="number"
            id="modal-cpf"
            disabled={modalLoading}
            value={modalCpfField}
            onChange={(e) => setModalCpfField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-password">Senha</CLabel>
          <CInput
            type="password"
            id="modal-password"
            placeholder="Digite uma nova senha"
            disabled={modalLoading}
            value={modalPasswordField}
            onChange={(e) => setModalPasswordField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-confirm_password">Confirmar Senha</CLabel>
          <CInput
            type="password"
            id="modal-confirm_password"
            placeholder="Confirme uma nova senha"
            disabled={modalLoading}
            value={modalConfirmPasswordField}
            onChange={(e) => setModalConfirmPasswordField(e.target.value)}
          />
        </CFormGroup>

      </Modal>
    </>
  )
}
