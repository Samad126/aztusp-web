import { useEffect, useState } from "react";
import { Alert, Box, Divider, MenuItem, Select, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";
import { apiPut } from "../../api/client.ts";
import { endpoints } from "../../api/endpoints.ts";
import type { Preferences, StartPage } from "../../api/types.ts";
import { fetchCached } from "../../api/useApi.ts";
import { useAuth } from "../../auth/AuthContext.ts";
import { readStartPage, writeStartPage } from "../../lib/startPage.ts";
import { startPages } from "../../navigation.ts";
import SettingRow from "./SettingRow.tsx";

/** The start page and "stay signed in" rows. The server keeps both, so they follow the student to every device. */
export default function PreferenceRows() {
  const { t } = useTranslation();
  const { username, demo } = useAuth();
  const [saved, setSaved] = useState<Preferences | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCached<Preferences>(endpoints.preferences, true)
      .then((loaded) => {
        if (cancelled) return;
        // A demo session has no server copy to read; its start page lives in this browser.
        const local = demo && username ? readStartPage(username) : null;
        setSaved(local ? { ...loaded, start_page: local } : loaded);
      })
      .catch((caught: unknown) => {
        if (!cancelled)
          setError(caught instanceof Error ? caught.message : String(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [demo, username]);

  const save = async (next: Preferences) => {
    const previous = saved;
    setSaved(next);
    setError(null);
    if (username) writeStartPage(username, next.start_page);
    // Demo sessions refuse every write, so their choice stays in this browser only.
    if (demo) return;
    try {
      setSaved(await apiPut<Preferences>(endpoints.preferences, next));
    } catch (caught) {
      setSaved(previous);
      if (username && previous) writeStartPage(username, previous.start_page);
      setError(
        caught instanceof Error ? caught.message : t("settings.saveFailed"),
      );
    }
  };

  const disabled = saved === null;

  return (
    <>
      <Divider />
      <SettingRow
        title={t("settings.startPage")}
        description={t("settings.startPageHint")}
        control={
          <Select
            size="small"
            value={saved?.start_page ?? "home"}
            disabled={disabled}
            onChange={(event) =>
              saved &&
              void save({
                ...saved,
                start_page: event.target.value as StartPage,
              })
            }
            inputProps={{ "aria-label": t("settings.startPage") }}
            sx={{ minWidth: 180 }}
          >
            {startPages.map((page) => (
              <MenuItem key={page.value} value={page.value}>
                {t(page.labelKey)}
              </MenuItem>
            ))}
          </Select>
        }
      />
      <Divider />
      <SettingRow
        title={t("settings.stay")}
        description={t("settings.stayHint")}
        footnote={t("settings.stayNote")}
        control={
          <Box sx={{ ml: { xs: -1.5, sm: 0 } }}>
            <Switch
              checked={saved?.stay_signed_in ?? false}
              // A demo session has no account to keep signed in.
              disabled={disabled || demo}
              onChange={(_, checked) =>
                saved && void save({ ...saved, stay_signed_in: checked })
              }
              slotProps={{ input: { "aria-label": t("settings.stay") } }}
            />
          </Box>
        }
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
