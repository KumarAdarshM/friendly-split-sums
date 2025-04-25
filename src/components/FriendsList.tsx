
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FriendAvatar from "./FriendAvatar";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FriendsList: React.FC = () => {
  const { friends, addFriend, removeFriend } = useAppContext();
  const [newFriendName, setNewFriendName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      addFriend(newFriendName.trim());
      setNewFriendName("");
      setOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users size={18} />
          Friends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-app-purple hover:bg-app-purple-dark">
                <Plus size={16} className="mr-2" /> Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new friend</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="friendName">Friend Name</Label>
                <Input
                  id="friendName"
                  placeholder="Enter friend's name"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button
                  className="bg-app-purple hover:bg-app-purple-dark"
                  onClick={handleAddFriend}
                  disabled={!newFriendName.trim()}
                >
                  Add Friend
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center p-3 bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FriendAvatar name={friend.name} color={friend.avatarColor} size="md" />
                  <span className="font-medium">{friend.name}</span>
                </div>
                {friend.name !== "You" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFriend(friend.id)}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Add friends to get started</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
