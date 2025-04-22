import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Users, UserPlus, Plus } from "lucide-react";
import { ChannelManagement } from "./ChannelManagement";
import { toast } from "react-toastify";
// Import your API client
// import { chatApi } from "@/apis/chatApi";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface Channel {
  id: string;
  name: string;
  members: User[];
  isGroup: boolean;
}

export const GroupChatManager = () => {
  const [groupChats, setGroupChats] = useState<Channel[]>([]);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [selectedGroupChat, setSelectedGroupChat] = useState<Channel | null>(null);
  
  // Fetch existing group chats
  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        // In a real app, call your API
        // const response = await chatApi.getGroupChats();
        // setGroupChats(response.data);
        
        // For demo purposes:
        setGroupChats([
          {
            id: "group-1",
            name: "Marketing Team",
            members: [
              { id: "1", name: "John Smith", email: "john@example.com", avatar: null },
              { id: "2", name: "Emily Johnson", email: "emily@example.com", avatar: null },
            ],
            isGroup: true
          },
          {
            id: "group-2",
            name: "Project Brainstorm",
            members: [
              { id: "1", name: "John Smith", email: "john@example.com", avatar: null },
              { id: "3", name: "Michael Brown", email: "michael@example.com", avatar: null },
            ],
            isGroup: true
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch group chats", error);
      }
    };
    
    fetchGroupChats();
  }, []);
  
  // Handle creating a new group chat
  const handleCreateGroupChat = async (name: string, members: User[]) => {
    try {
      // In a real app, call your API
      // const response = await chatApi.createGroupChat({
      //   name,
      //   memberIds: members.map(member => member.id)
      // });
      
      // For demo purposes:
      const newGroup: Channel = {
        id: `group-${Date.now()}`,
        name,
        members,
        isGroup: true
      };
      
      setGroupChats(prev => [...prev, newGroup]);
      toast.success("Group chat created successfully");
    } catch (error) {
      toast.error("Failed to create group chat");
      console.error(error);
    }
  };
  
  // Handle adding members to an existing group
  const handleAddMembersToGroup = async (channelId: string, newMembers: User[]) => {
    try {
      // In a real app, call your API
      // await chatApi.addMembersToGroup({
      //   channelId,
      //   memberIds: newMembers.map(member => member.id)
      // });
      
      // Update local state
      setGroupChats(prev => prev.map(chat => {
        if (chat.id === channelId) {
          return {
            ...chat,
            members: [...chat.members, ...newMembers]
          };
        }
        return chat;
      }));
      
      toast.success(`Added ${newMembers.length} members to the group`);
    } catch (error) {
      toast.error("Failed to add members to group");
      console.error(error);
    }
  };
  
  // Open dialog to add members to specific group
  const handleAddMembers = (groupChat: Channel) => {
    setSelectedGroupChat(groupChat);
    setShowAddMembersDialog(true);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Group Chats</h2>
        <Button 
          onClick={() => setShowCreateGroupDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Group Chat
        </Button>
      </div>
      
      {groupChats.length > 0 ? (
        <div className="space-y-3">
          {groupChats.map(group => (
            <div 
              key={group.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members.length} members</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleAddMembers(group)}
                  className="flex items-center gap-1"
                >
                  <UserPlus size={16} />
                  Add Members
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
          <Users className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-gray-500">No group chats yet</p>
          <Button 
            onClick={() => setShowCreateGroupDialog(true)}
            className="mt-3"
            variant="outline"
          >
            Create your first group chat
          </Button>
        </div>
      )}
      
      {/* Create Group Chat Dialog */}
      <ChannelManagement
        open={showCreateGroupDialog}
        onClose={() => setShowCreateGroupDialog(false)}
        onCreateChannel={handleCreateGroupChat}
        existingChannel={null}
      />
      
      {/* Add Members Dialog */}
      <ChannelManagement
        open={showAddMembersDialog}
        onClose={() => setShowAddMembersDialog(false)}
        onCreateChannel={() => {}}
        existingChannel={selectedGroupChat}
        onAddMembers={handleAddMembersToGroup}
      />
    </div>
  );
};
