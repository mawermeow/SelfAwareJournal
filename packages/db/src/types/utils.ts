// Akakaze Projects (c) by Akakaze
//
// Akakaze Projects is licensed under a
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
//
// You should have received a copy of the license along with this
// work. If not, see <http://creativecommons.org/licenses/by-nc-sa/4.0/>.

export type Logger = {
  info: (label: string, content?: any) => void;
  error: (label: string, content?: any) => void;
  debug: (label: string, content?: any) => void;
  end: () => void;
};

export enum PermissionActionEnum {
  edit = "edit",
  create = "create",
  view = "view",
  delete = "delete",
  "edit-password" = "edit-password",
  "*" = "*",
}

export enum DataPermissionLevelEnum {
  my = "my",
  branch = "branch",
  organization = "organization",
  nil = "nil",
}
