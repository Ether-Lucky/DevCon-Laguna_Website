export type PortalOfficer = {
  id: string;
  title: string;
  display_order: number;
  name: string;
  photo_url: string | null;
};

export type PortalLanding = {
  officers: PortalOfficer[];
};
