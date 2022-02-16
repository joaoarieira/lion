import { Box, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { IRole } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames, translateRole } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { FormSelect } from '../../../../components/FormSelect';

// TODO: colocar opção para vincular monitor à monitoria ao cadastrá-lo

interface IUserCreateValues {
  name: string;
  email: string;
  password: string;
  role_id: string;
}

export function UserCreate(): JSX.Element {
  document.title = 'Usuário | Lion';

  const [roles, setRoles] = useState<IRole[]>([]);

  const { authenticated, userAuthenticated } = useAuth();
  const {
    post: postUser,
    response: responseUser,
    loading: loadingUser,
  } = useFetch('/users');
  const {
    get: getRoles,
    response: responseRoles,
    loading: loadingRoles,
  } = useFetch('/roles');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 50 caracteres'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string()
      .min(8, 'Mínimo 8 caracteres')
      .required('Senha é obrigatória'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Confirmação divergente')
      .required('Confirme a senha'),
    role_id: Yup.string().required('Nível é obrigatório'),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createUser(values);
    },
  });

  const fetchRolesData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getRoles();

        if (responseRoles.ok) {
          setRoles(responseRoles.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos níveis. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, getRoles, responseRoles, userAuthenticated.role]);

  const createUser = useCallback(
    async (values: IUserCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await postUser(values);

          if (responseUser.ok) {
            createForm.resetForm();
            toast.success('Usuário criado com sucesso.');
          } else {
            toast.error(
              'Falha ao criar este usuário. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      createForm,
      postUser,
      responseUser.ok,
      userAuthenticated.role,
    ]
  );

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Novo usuário" />

      <FormPaper>
        <form autoComplete="off" onSubmit={createForm.handleSubmit}>
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12} md={6}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Email"
                placeholder="usuario@exemplo.com"
                name="email"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormInput
                label="Senha"
                type="password"
                placeholder="Digite a senha"
                name="password"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormInput
                label="Confirme a senha"
                type="password"
                placeholder="Digite a senha novamente"
                name="password_confirmation"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="role_id"
                label="Nível de acesso"
                value={createForm.values.role_id}
                disabled={loadingRoles}
                fullWidth
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {translateRole(role.name)}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loadingUser} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default UserCreate;
