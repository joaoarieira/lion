import { Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { isUUID, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { IUser } from '../../../../@types/entities';
import { useParams } from 'react-router-dom';
import { CrudHeader } from '../../../../components/CrudHeader';
import SwitchLabel from '../../../../components/SwitchLabel';

interface IUserEditValues {
  name: string;
  email?: string;
  password?: string;
  is_active: boolean;
}

export function UserEdit(): JSX.Element {
  document.title = 'Usuário | Lion';

  const [user, setUser] = useState<IUser | undefined>();

  const { id } = useParams();
  const { authenticated, userAuthenticated } = useAuth();
  const { get, put, response, loading } = useFetch('/users');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 50 caracteres'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().min(8, 'Mínimo 8 caracteres'),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref('password'), undefined],
      'Confirmação divergente'
    ),
    is_active: Yup.boolean().required('Obrigatório'),
  });

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      password_confirmation: '',
      is_active: user?.is_active ?? false,
    },
    validationSchema,
    onSubmit: async ({ password, password_confirmation, email, ...values }) => {
      let preparedValues = values as IUserEditValues;
      if (password.length > 8) {
        if (password === password_confirmation) {
          preparedValues = { password, ...preparedValues };
        }
      }

      if (email !== editForm.initialValues.email) {
        preparedValues = { email, ...preparedValues };
      }

      await editUser(preparedValues);
    },
  });

  const fetchUserData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        if (isUUID(id)) {
          await get(id);

          if (response.ok) {
            setUser(response.data);
          } else {
            toast.error(
              'Falha ao obter os dados do usuário. Tente novamente mais tarde.'
            );
          }
        }
      }
    }
  }, [authenticated, get, id, response, userAuthenticated.role]);

  const editUser = useCallback(
    async (values: IUserEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await put(id, values);

          if (response.ok) {
            setUser(response.data);
            toast.success('Usuário editado com sucesso.');
          } else {
            toast.error(
              'Falha ao editar este usuário. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [authenticated, id, put, response, userAuthenticated.role]
  );

  const handleChangeStatus = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      editForm.setFieldValue('is_active', checked);
    },
    [editForm]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Editar usuário" />

      <FormPaper>
        <form autoComplete="off" onSubmit={editForm.handleSubmit}>
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12} md={6}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Email"
                placeholder="usuario@exemplo.com"
                name="email"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Senha"
                type="password"
                placeholder="Digite a senha"
                name="password"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Confirme a senha"
                type="password"
                placeholder="Digite a senha novamente"
                name="password_confirmation"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={1}>
              <SwitchLabel
                label={editForm.values.is_active ? 'Ativo' : 'Inativo'}
                checked={editForm.values.is_active}
                onChange={handleChangeStatus}
              />
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loading} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default UserEdit;
