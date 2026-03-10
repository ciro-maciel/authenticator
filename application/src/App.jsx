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
  }, []);

  useEffect(() => {
    fetchMembers(activeTokenId);
  }, [activeTokenId]);

  const activeToken = getActiveToken();

  return (
    <Container size="xl" py={{ base: 10, md: 60 }}>
      <Stack gap={{ base: 24, md: 48 }}>
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

        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 24 }}
          align="flex-start"
        >
          {/* Zen Stage Context: Performance */}
          <Box>
            <Paper
              p={{ base: 20, md: 40 }}
              style={{
                borderStyle: "dashed",
                minHeight: 240,
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
          <Stack gap={32}>
            <Stack gap="sm">
              <Text fz={11} fw={800} c="gray.4" tt="uppercase" lts="1.5px">
                Tokens Ativos ({tokens.length})
              </Text>
              <TokenList
                tokens={tokens}
                activeId={activeTokenId}
                onSelect={setActiveToken}
              />
            </Stack>

            {/* <Box visibleFrom="sm" h="200"></Box> */}

            <MemberList members={members} onInvite={openMemberModal} />
          </Stack>
        </SimpleGrid>

        <Group justify="space-between" gap="md">
          <Text
            fz={10}
            fw={800}
            c="gray.3"
            tt="uppercase"
            lts="2px"
            ta={{ base: "center", sm: "left" }}
          >
            Security Protocol{" "}
            <Box component="span" visibleFrom="xs">
              v1.0.0
            </Box>
          </Text>
          <Group gap={6} c="gray.3">
            <Text fz={10} fw={800} tt="uppercase" lts="2px">
              © 2026
            </Text>
            <Box w={8} h={1} bg="gray.2" visibleFrom="xs" />
            <Text fz={10} fw={900} tt="uppercase" lts="2px">
              Ciro{" "}
              <Box component="span" visibleFrom="sm">
                Cesar
              </Box>{" "}
              Maciel
            </Text>
          </Group>
        </Group>

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
            addMember(values, activeTokenId);
          }}
        />
      </Stack>
    </Container>
  );
}

export default App;
