import React from "react";
import {
  Modal,
  TextInput,
  Stack,
  Button,
  Text,
  Title,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const AddMemberModal = ({ opened, onClose, onSubmit }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      role: "member",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Requerido" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
    },
  });

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Stack gap={4}>
          <Text fz={10} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
            ACCESS PROTOCOL
          </Text>
          <Title order={2} fz={24} fw={900} lts="-0.02em">
            Convidar Membro
          </Title>
          <Text fz={12} c="gray.5" fw={500}>
            Um token de acesso exclusivo será gerado para este membro.
          </Text>
        </Stack>
      }
      padding={40}
      radius="lg"
      centered
      size="md"
      styles={{
        header: { marginBottom: 30 },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <TextInput
            label={
              <Text fz={10} fw={800} c="gray.4" tt="uppercase" lts="1px" mb={4}>
                NOME COMPLETO
              </Text>
            }
            placeholder="Ex: João Silva"
            {...form.getInputProps("name")}
            required
            variant="default"
          />
          <TextInput
            label={
              <Text fz={10} fw={800} c="gray.4" tt="uppercase" lts="1px" mb={4}>
                EMAIL CORPORATIVO
              </Text>
            }
            placeholder="joao@empresa.com"
            {...form.getInputProps("email")}
            required
          />
          <Select
            label={
              <Text fz={10} fw={800} c="gray.4" tt="uppercase" lts="1px" mb={4}>
                NÍVEL DE ACESSO
              </Text>
            }
            data={[
              { value: "admin", label: "Administrador" },
              { value: "member", label: "Membro" },
            ]}
            {...form.getInputProps("role")}
            variant="default"
          />
          <Button
            type="submit"
            fullWidth
            size="md"
            h={50}
            bg="gray.9"
            fw={800}
            tt="uppercase"
            lts="1px"
            mt="lg"
          >
            ENVIAR CONVITE
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
