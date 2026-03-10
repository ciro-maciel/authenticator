import { create } from "zustand";
import { notifications } from "@mantine/notifications";

export const useTokenStore = create((set, get) => ({
  tokens: [],
  members: [],
  activeTokenId: null,
  isLoading: false,
  error: null,

  // Mock data for initial development
  setTokens: (tokens) => set({ tokens }),

  setActiveToken: (id) => set({ activeTokenId: id }),

  getActiveToken: () => {
    const { tokens, activeTokenId } = get();
    return tokens.find((t) => t.id === activeTokenId) || tokens[0];
  },

  fetchTokens: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/tokens");
      const data = await response.json();
      set({ tokens: data, isLoading: false });
      if (data.length > 0 && !get().activeTokenId) {
        set({ activeTokenId: data[0].id });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToken: async (tokenData) => {
    set({ isLoading: true });
    try {
      // Sanitize secret: remove spaces which are common in MFA codes
      const sanitizedData = {
        ...tokenData,
        secret: tokenData.secret.replace(/\s/g, ""),
      };

      const response = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sanitizedData, companyId: "1" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao adicionar token");
      }

      await get().fetchTokens(); // Refresh list from server

      notifications.show({
        title: "Sucesso",
        message: "Segurança validada e salva",
        color: "gray.9",
      });
    } catch (error) {
      set({ isLoading: false });
      notifications.show({
        title: "Erro de Protocolo",
        message: error.message,
        color: "red",
      });
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/members");
      const data = await response.json();
      set({ members: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addMember: async (memberData) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberData, companyId: "1" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao adicionar membro");
      }

      await get().fetchMembers();

      notifications.show({
        title: "Sucesso",
        message: "Membro convidado e adicionado",
        color: "gray.9",
      });
    } catch (error) {
      set({ isLoading: false });
      notifications.show({
        title: "Erro de Protocolo",
        message: error.message,
        color: "red",
      });
    }
  },

  removeMember: async (id) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao remover membro");

      await get().fetchMembers();

      notifications.show({
        title: "Removido",
        message: "Acesso revogado com sucesso",
        color: "gray.9",
      });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: error.message,
        color: "red",
      });
    }
  },
}));
