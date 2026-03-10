import React, { useState, useEffect, useCallback } from "react";
import {
  Stack,
  Text,
  Title,
  RingProgress,
  Center,
  UnstyledButton,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";
import { useTokenStore } from "../store/token-store";

const TokenStage = ({ token }) => {
  const [code, setCode] = useState("000000");
  const [timeLeft, setTimeLeft] = useState(30);
  const clipboard = useClipboard({ timeout: 2000 });
  const removeToken = useTokenStore((state) => state.removeToken);

  const updateCode = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`/api/tokens/${token.id}/code`);
      const data = await response.json();
      setCode(data.code);
      setTimeLeft(data.remaining);
    } catch (error) {
      console.error("Failed to fetch TOTP code:", error);
    }
  }, [token]);

  useEffect(() => {
    updateCode();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          updateCode();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [updateCode]);

  if (!token) return null;

  return (
    <Stack
      align="center"
      gap={{ base: 20, md: 32 }}
      py={{ base: 10, md: 20 }}
      w="100%"
      style={{ position: "relative" }}
    >
      <Group
        style={{ position: "absolute", top: 0, right: 0 }}
        gap="xs"
        visibleFrom="sm"
      >
        <Tooltip label="Sincronizar" position="bottom" withArrow fz={10}>
          <ActionIcon
            variant="subtle"
            color="gray.4"
            onClick={updateCode}
            size="md"
          >
            <IconRefresh size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Excluir Token" position="bottom" withArrow fz={10}>
          <ActionIcon
            variant="subtle"
            color="gray.4"
            onClick={() => {
              if (confirm("Tem certeza que deseja excluir este token?")) {
                removeToken(token.id);
              }
            }}
            size="md"
            className="hover-danger"
          >
            <IconTrash size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Stack align="center" gap={4} w="100%">
        <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="2px">
          {token.issuer} / {token.label}
        </Text>
        <UnstyledButton
          onClick={() => {
            clipboard.copy(code);
            notifications.show({
              title: "COPIADO",
              message: "Código MFA copiado",
              color: "gray.9",
              icon: <IconCopy size={16} />,
            });
          }}
        >
          <Title
            order={1}
            fz={{ base: 56, xs: 64, sm: 80, md: 120 }}
            fw={900}
            lh={1}
            lts="-0.04em"
          >
            {code}
          </Title>
        </UnstyledButton>
      </Stack>

      <RingProgress
        size={90}
        thickness={6}
        roundCaps
        sections={[{ value: (timeLeft / 30) * 100, color: "gray.9" }]}
        label={
          <Center>
            <Text fz={12} fw={900} c="gray.9">
              {timeLeft}S
            </Text>
          </Center>
        }
      />
    </Stack>
  );
};

export default TokenStage;
