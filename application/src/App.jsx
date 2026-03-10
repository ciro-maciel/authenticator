import React, { useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Box,
  Paper,
  Group,
  Divider,
  Button,
} from "@mantine/core";
import { useTokenStore } from "./store/token-store";
import TokenStage from "./components/TokenStage";
import TokenList from "./components/TokenList";
import AddTokenModal from "./components/AddTokenModal";
import AddMemberModal from "./components/AddMemberModal";
import MemberList from "./components/MemberList";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

function App() {
  const {
    tokens,
    members,
    fetchTokens,
    fetchMembers,
    activeTokenId,
    setActiveToken,
    getActiveToken,
    addMember,
  } = useTokenStore();
  const [tokenModalOpened, { open: openTokenModal, close: closeTokenModal }] =
    useDisclosure(false);
  const [
    memberModalOpened,
    { open: openMemberModal, close: closeMemberModal },
  ] = useDisclosure(false);

  useEffect(() => {
    fetchTokens();
    fetchMembers();
  }, []);

  const activeToken = getActiveToken();

  return (
    <Container size="xl" py={{ base: 20, md: 80 }}>
      <Stack gap={{ base: 40, md: 60 }}>
        {/* Zen Header: O Anúncio */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Stack gap={4}>
            <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
              Corporate Storage
            </Text>
            <Title
              order={1}
              fz={{ base: 28, xs: 32, sm: 42, md: 56 }}
              fw={900}
              lts="-0.04em"
              lh={1.1}
            >
              Shared Authenticator
            </Title>
          </Stack>
          <Button
            variant="default"
            leftSection={<IconPlus size={16} stroke={2} />}
            onClick={openTokenModal}
            visibleFrom="sm"
            size="md"
            radius="md"
            fw={800}
          >
            NOVO TOKEN
          </Button>
        </Group>

        {/* Mobile Action Trigger */}
        <Button
          variant="default"
          leftSection={<IconPlus size={16} stroke={2} />}
          onClick={openTokenModal}
          hiddenFrom="sm"
          fullWidth
          size="md"
          radius="md"
          fw={800}
        >
          NOVO TOKEN
        </Button>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 120 }}>
          {/* Zen Stage Context: Performance */}
          <Box>
            <Paper
              p={{ base: 30, md: 60 }}
              style={{
                borderStyle: "dashed",
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeToken ? (
                <TokenStage token={activeToken} />
              ) : (
                <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
                  Nenhum token selecionado
                </Text>
              )}
            </Paper>
          </Box>

          {/* Zen Dense Context: Data */}
          <Stack gap={40}>
            <Stack gap="md">
              <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
                Tokens Ativos ({tokens.length})
              </Text>
              <TokenList
                tokens={tokens}
                activeId={activeTokenId}
                onSelect={setActiveToken}
              />
            </Stack>

            <MemberList members={members} onInvite={openMemberModal} />
          </Stack>
        </SimpleGrid>

        <Box bd={{ top: "1px solid gray.2" }} pt="xl" mt="xl">
          <Group justify="space-between">
            <Text fz={10} fw={800} c="gray.3" tt="uppercase" lts="2px">
              Zen Security Protocol v1.0.0
            </Text>
            <Text fz={10} fw={800} c="gray.3" tt="uppercase" lts="2px">
              © 2026 RiLiGar
            </Text>
          </Group>
        </Box>

        <AddTokenModal
          opened={tokenModalOpened}
          onClose={closeTokenModal}
          onSubmit={(values) => {
            useTokenStore.getState().addToken(values);
          }}
        />

        <AddMemberModal
          opened={memberModalOpened}
          onClose={closeMemberModal}
          onSubmit={(values) => {
            addMember(values);
          }}
        />
      </Stack>
    </Container>
  );
}

export default App;
