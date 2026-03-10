import React, { useState, useEffect } from "react";
import {
  Stack,
  Text,
  Title,
  RingProgress,
  Center,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";

const TokenStage = ({ token }) => {
  const [code, setCode] = useState("000000");
  const [timeLeft, setTimeLeft] = useState(30);
  const clipboard = useClipboard({ timeout: 2000 });

  useEffect(() => {
    if (!token) return;

    const updateCode = async () => {
      try {
        const response = await fetch(`/api/tokens/${token.id}/code`);
        const data = await response.json();
        setCode(data.code);
        setTimeLeft(data.remaining);
      } catch (error) {
        console.error("Failed to fetch TOTP code:", error);
      }
    };

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
  }, [token]);

  if (!token) return null;

  return (
    <Stack align="center" gap={60} py={40} w="100%">
      <Stack align="center" gap={8} w="100%">
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
