import React from "react";
import {
  Stack,
  Group,
  Text,
  Avatar,
  ActionIcon,
  Tooltip,
  Paper,
  Box,
} from "@mantine/core";
import { IconTrash, IconUserPlus } from "@tabler/icons-react";
import { useTokenStore } from "../store/token-store";

const MemberList = ({ members, onInvite }) => {
  const removeMember = useTokenStore((state) => state.removeMember);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
          Membros com Acesso
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray.6"
          onClick={onInvite}
          size="sm"
        >
          <IconUserPlus size={16} stroke={2.5} />
        </ActionIcon>
      </Group>

      <Stack gap={4}>
        {members.map((member) => (
          <Group
            key={member.id}
            justify="space-between"
            py="sm"
            bd={{ bottom: "1px solid gray.1" }}
            style={{ transition: "all 0.2s ease" }}
          >
            <Group gap="sm">
              <Avatar color="gray.9" variant="light" radius="xl" size="sm">
                {member.name.charAt(0)}
              </Avatar>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="gray.9">
                  {member.name}
                </Text>
                <Group gap={4}>
                  <Text size="xs" c="gray.5">
                    {member.email}
                  </Text>
                  <Box
                    w={4}
                    h={4}
                    bg="gray.2"
                    style={{ borderRadius: "50%" }}
                  />
                  <Text
                    size="xs"
                    fw={800}
                    c="gray.9"
                    tt="uppercase"
                    lts="0.5px"
                  >
                    {member.token}
                  </Text>
                </Group>
              </Stack>
            </Group>

            <Group gap="xl">
              <Text fz={10} fw={800} tt="uppercase" c="gray.4" lts="1px">
                {member.role}
              </Text>
              <Tooltip label="Revogar Acesso" position="left" withArrow fz={10}>
                <ActionIcon
                  variant="subtle"
                  color="gray.4"
                  onClick={() => removeMember(member.id)}
                  size="sm"
                  className="hover-danger"
                >
                  <IconTrash size={14} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        ))}
        {members.length === 0 && (
          <Paper
            p="xl"
            radius="md"
            bg="gray.0"
            bd="dashed gray.2"
            style={{ textAlign: "center" }}
          >
            <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1px">
              Nenhum membro vinculado a este protocolo
            </Text>
          </Paper>
        )}
      </Stack>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hover-danger:hover {
          color: var(--mantine-color-red-6) !important;
        }
      `,
        }}
      />
    </Stack>
  );
};

export default MemberList;
