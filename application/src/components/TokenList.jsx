import React from "react";
import {
  Stack,
  Group,
  Text,
  UnstyledButton,
  ScrollArea,
  Avatar,
} from "@mantine/core";
import { IconFingerprint } from "@tabler/icons-react";

const TokenList = ({ tokens, activeId, onSelect }) => {
  return (
    <ScrollArea>
      <Stack gap={2}>
        {tokens.map((token) => (
          <UnstyledButton
            key={token.id}
            onClick={() => onSelect(token.id)}
            p="md"
            style={{
              borderRadius: "var(--mantine-radius-md)",
              backgroundColor:
                activeId === token.id
                  ? "var(--mantine-color-gray-1)"
                  : "transparent",
              transition: "all 0.15s ease",
              border:
                activeId === token.id
                  ? "1px solid var(--mantine-color-gray-2)"
                  : "1px solid transparent",
            }}
          >
            <Group justify="space-between">
              <Group gap="md">
                <IconFingerprint
                  size={18}
                  stroke={1.5}
                  color={
                    activeId === token.id
                      ? "var(--mantine-color-gray-9)"
                      : "var(--mantine-color-gray-4)"
                  }
                />
                <Stack gap={0}>
                  <Title
                    order={4}
                    fz={14}
                    fw={800}
                    c={activeId === token.id ? "gray.9" : "gray.7"}
                  >
                    {token.label}
                  </Title>
                  <Text fz={10} fw={800} tt="uppercase" c="gray.4" lts="1px">
                    {token.issuer}
                  </Text>
                </Stack>
              </Group>
              {activeId === token.id && (
                <Text
                  fz={9}
                  fw={900}
                  tt="uppercase"
                  c="gray.9"
                  lts="1px"
                  bg="gray.2"
                  px={6}
                  py={2}
                  style={{ borderRadius: 4 }}
                >
                  LINKED
                </Text>
              )}
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </ScrollArea>
  );
};

import { Title } from "@mantine/core"; // Adding missing import
export default TokenList;
