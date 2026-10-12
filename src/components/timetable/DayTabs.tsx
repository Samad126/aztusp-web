import { useState } from 'react'
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react'
import 'swiper/css'
import { weekdayLabel } from '../../i18n/index.ts'
import type { ScheduleGrid } from '../../lib/timetable/model.ts'
import { openingTab } from '../../lib/timetable/week.ts'
import LessonCard from './LessonCard.tsx'
import TextCard from './TextCard.tsx'

/**
 * On a phone: one weekday at a time, with the lessons listed by time. The days swipe side to side and the tabs follow
 * them, and a tap on a tab slides to that day. Times with no lesson that day are left out.
 */
export default function DayTabs({ grid }: { grid: ScheduleGrid }) {
  const { t } = useTranslation()
  // Open on today's weekday in Baku time (Friday at the weekend), or the first weekday with lessons if today isn't shown.
  const [selected, setSelected] = useState(() => openingTab(grid.days))
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const current = Math.min(selected, Math.max(0, grid.days.length - 1))

  const goTo = (index: number) => {
    setSelected(index)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    swiper?.slideTo(index, reduceMotion ? 0 : undefined)
  }

  return (
    <Box>
      <Tabs
        value={current}
        onChange={(_, value: number) => goTo(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}
      >
        {grid.days.map((item, index) => (
          <Tab
            key={item.name}
            value={index}
            label={weekdayLabel(item.index, item.name)}
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44, px: 1.5 }}
          />
        ))}
      </Tabs>

      <Swiper
        onSwiper={setSwiper}
        initialSlide={current}
        onSlideChange={(instance) => setSelected(instance.activeIndex)}
        // Swipes count anywhere on the track. By default only the slide wrapper listens, and once the track has moved to a later day
        // the wrapper no longer covers the whole track, so a swipe started there was ignored.
        touchEventsTarget="container"
      >
        {grid.days.map((day, index) => {
          const rows = grid.slots.map((slot, slotIndex) => ({ slot, items: day.cells[slotIndex] })).filter((row) => row.items.length > 0)
          return (
            <SwiperSlide
              key={day.name}
              role="group"
              aria-roledescription="slide"
              aria-label={weekdayLabel(day.index, day.name)}
              // Only the day in view can be reached by keyboard, so the other days' lessons are skipped when tabbing.
              inert={index !== current}
            >
              <Stack spacing={1.5} sx={{ p: 1.5 }}>
                {rows.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: 'text.primary', opacity: 0.7, px: 0.5 }}>{t('schedule.noLessonsDay')}</Typography>
                ) : (
                  rows.map((row) => (
                    <Box key={row.slot} sx={{ display: 'grid', gridTemplateColumns: '88px minmax(0, 1fr)', gap: 1.25, alignItems: 'start' }}>
                      <Typography sx={{ pt: 1, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        {row.slot}
                      </Typography>
                      <Stack spacing={0.75}>
                        {row.items.map((item, itemIndex) =>
                          item.text ? <TextCard key={itemIndex} text={item.text} /> : <LessonCard key={itemIndex} item={item} />,
                        )}
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Box>
  )
}
